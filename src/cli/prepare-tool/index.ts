import { Container } from 'inversify';
import { rootContainer } from '../services';
import { PrepareDartService } from '../tools/dart';
import { PrepareDockerService } from '../tools/docker';
import { PrepareDotnetService } from '../tools/dotnet';
import { PrepareFlutterService } from '../tools/flutter';
import {
  PrepareJavaJdkService,
  PrepareJavaJreService,
  PrepareJavaService,
} from '../tools/java';
import { PrepareNodeService } from '../tools/node';
import { logger } from '../utils';
import { PrepareLegacyToolsService } from './prepare-legacy-tools.service';
import { PREPARE_TOOL_TOKEN, PrepareToolService } from './prepare-tool.service';

function prepareContainer(): Container {
  logger.trace('preparing container');
  const container = new Container();
  container.parent = rootContainer;

  // core services
  container.bind(PrepareToolService).toSelf();
  container.bind(PrepareLegacyToolsService).toSelf();

  // tool services
  container.bind(PREPARE_TOOL_TOKEN).to(PrepareDartService);
  container.bind(PREPARE_TOOL_TOKEN).to(PrepareDotnetService);
  container.bind(PREPARE_TOOL_TOKEN).to(PrepareDockerService);
  container.bind(PREPARE_TOOL_TOKEN).to(PrepareFlutterService);
  container.bind(PREPARE_TOOL_TOKEN).to(PrepareJavaService);
  container.bind(PREPARE_TOOL_TOKEN).to(PrepareJavaJreService);
  container.bind(PREPARE_TOOL_TOKEN).to(PrepareJavaJdkService);
  container.bind(PREPARE_TOOL_TOKEN).to(PrepareNodeService);

  logger.trace('preparing container done');
  return container;
}

export function prepareTools(
  tools: string[],
  dryRun = false,
): Promise<number | void> {
  const container = prepareContainer();
  return container.get(PrepareToolService).execute(tools, dryRun);
}
